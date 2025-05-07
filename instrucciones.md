docker-compose up -d

./init_cluster.sh

docker-compose --profile backend up --build -d

docker-compose --profile test up -d auth_service auth_test

docker exec auth_test_container npm run test:integration:coverage


  auth_test:
    build:
      context: ./auth_service
      dockerfile: Dockerfile.test
    container_name: auth_service_test_container
    profiles:
      - test
    depends_on:
      - postgres
      - mongos1
    environment:
      DB_TYPE: ${DB_TYPE}
      MONGO_URI: ${MONGO_URI}
      DB_HOST: ${POSTGRES_HOST}
      DB_USER: ${POSTGRES_USER}
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      DB_NAME: ${POSTGRES_DB}
      DB_PORT: ${POSTGRES_PORT}
      AUTH_PORT: ${AUTH_PORT}
      JWT_SECRET: ${JWT_SECRET}
    networks:
      - app_network