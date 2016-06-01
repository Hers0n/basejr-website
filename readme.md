# Base Jr.
  - `app` @ [http://www.basejr.com.br](http://www.basejr.com.br)
  - `blog` @ [http://blog.basejr.com.br](http://blog.basejr.com.br)
  - `server` @ [http://internal.basejr.com.br](http://internal.basejr.com.br)

### dependencies
  - composer
  - npm
  - bower
  - gulp

### setup
  - `npm install`
  
### tasks
  - `npm run build` - builds everything
  - `npm run build:app` - builds `app` to `dist/public`
  - `npm run build:blog` - builds `blog` to `dist/blog`
  - `npm run build:server` - builds `server` to `dist/server`
  - `npm run preview:app` - serves `app` @ [http://localhost:9000](http://localhost:9000)
  - `npm run preview:public` - serves `dist/public` @ [http://localhost:9002](http://localhost:9002)
  - `npm run preview:server` - serves `server` @ [http://localhost:9001](http://localhost:9001)
