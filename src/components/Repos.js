import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) {
      return total;
    }
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }

    return total;
  }, {});

  /* Our first graph - Pie Chart
     Object.values to make array out of our data 
    .sort to sort it by value from high to low 
    .slice to show only first 5 */
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  /* Our second graph - doughnut for stars
    Object.values to make array out of our data 
   .sort to order them from high star to low star 
   .map to rename stars as value, so we don't need to change setting
   .slice to look only at top 5 */
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars }; // overwrite value with stars
    })
    .slice(0, 5);

  /* This will get names of repo's stars and forks for both our bar graphs 
      by this setup it will overwrite repo's with same count of stars and forks
      But it will probably happen only on smaller values, not top 5    */
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };

      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );
  /*  This will get repo's by star count, last are highest
      .slice to get only highest 5
      .reverse to get them from high to low */
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();
  console.log(forks);

  return (
    <section className="global-section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
