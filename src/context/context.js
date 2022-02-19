import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext(); // gives acces to Provider/Consumer
// GithubContext.Provider to access. And Consumer is obsolete with UseContext HOOK

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubuser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  // request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const SearchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    /* you can do .then or .catch */
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(response);
    if (response) {
      setGithubuser(response.data);
      const { login, followers_url } = response.data;
      /* Change logic to load all at once 
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
        setRepos(response.data)
      );
      axios(`${followers_url}?per_page=100`).then((response) =>
        setFollowers(response.data)
      ); */
      /* now await until all is loaded and then show all */
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results; // getting back array with 2 items
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user with that user name");
    }
    checkRequests();
    setIsLoading(false);
  };

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        setRequests(remaining);
        if (remaining === 0) {
          toggleError({
            show: true,
            msg: "Sorry, you have exceeded your hourly rate limit! ",
          });
        }
      })
      .catch((error) => console.log(error));
  };
  /* ES6 defaults are passed here */
  const toggleError = (show = false, msg = "") => {
    setError(show, msg);
  };

  /* Here we will use useEffect without arrow function! */
  useEffect(checkRequests, []);

  return (
    // using ES6 - {id:id, name=name} => {id,name}
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        SearchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

// export Context and Provider
export { GithubProvider, GithubContext };

// now wrap our app in GithubProvider in index.js
