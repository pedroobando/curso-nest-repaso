<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokedex

## Intalacion

1. Clonar repositorio
2. Ejecutar yarn

```
yarn install
```

3. Instalar el nest/cli

```
npm i -g @nestjs/cli
```

4. Levantar base de datos (contenedor)

```
docker compose up -d
```

5. Clonar o renombrar archivo `.env.template` a `.env`

6. Llenar las variables de archivo `.env`

7. Ejecutar la aplicacion en dev:

```
yarn start:dev
```

8. Coneccion a la base de datos
   environment:
   - MONGO_DATABASE=nest-pokemon

```
mongodb://{url}:{puerto}/{nombre-basedatos}
mongodb://localhost:27024/nest-pokemon
```

9. Construccion de la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

## Stack usado

- Nestjs
- MongoDb

# Production Build

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Notas

Heroku redeploy sin cambios:

```
git commit --allow-empty -m "Tigger Heroku deploy"
git push heroku <master|main>
```
