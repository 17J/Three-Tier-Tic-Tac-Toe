
FROM postgres:15

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_DB=gamerzo
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
