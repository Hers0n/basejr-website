# Base Jr.
  - [https://basejr-website.herokuapp.com/](https://basejr-website.herokuapp.com/)

### global dependencies
  - composer
  - npm
  - bower
  - gulp

### development
  - clone this && cd this
  - `npm install` - install all dependencies including composer and bower
  
### tasks
  - `npm run build` - builds the app to `dist/public`
  - `npm run build:blog` - builds the blog to `dist/blog`
  - `npm run serve` - serves the app at [http://localhost:9000](http://localhost:9000) (file watcher enabled)
  - `npm run serve:api` - serves the API at [http://localhost:9001](http://localhost:9001)
  - `npm run serve:dist` - serves `dist/public` at [http://localhost:9002](http://localhost:9002)
  - `npm run deploy` - builds and deploys the app to [https://basejr-website.herokuapp.com/](https://basejr-website.herokuapp.com/)
