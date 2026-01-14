/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix: "/protein-calculator",
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Daily Protein Planner`,
        short_name: `Protein`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#4f46e5`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
  ],
}
