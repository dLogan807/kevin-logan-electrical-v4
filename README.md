## About

A small business website developed for `Kevin Logan Electrical`.

#### Deployment Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/fbd64af4-062b-4ad2-9397-8723d4b86d61/deploy-status)](https://app.netlify.com/sites/kevinloganelectrical/deploys)

## Technologies

At its core, this website uses the [Next.js 15](https://nextjs.org/) React Framework and the [Mantine 7](https://mantine.dev/) UI library. You can find all packages used in the production build [here](https://github.com/dLogan807/kevin-logan-electrical-v4/blob/main/licenses.json).

## Features

- **Responsive Design** is a core focus of the website, where it is designed to adapt to a wide range of devices.
- **Performance** was a key consideration. To achieve this, best practices were followed, and pages were carefully optimised. See the [PageSpeed Insights report](https://pagespeed.web.dev/analysis/https-www-kevinloganelectrical-co-nz/vp2fcnc48t?form_factor=mobile).
- An **Adaptive Light/Dark Theme** was implemented for modernity and convenience. Defaults to the user's browser theme and stores its last interaction state.
- A **Contact Form** featuring Zod form validation and Mantine's notification system. Client-side validation is done immediately, then validating on the server when submitted (including with reCAPTCHA v3) via Next.JS server actions.
