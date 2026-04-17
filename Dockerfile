# docker load instructions

# 1. select base image
FROM node:24

# 2. set working directory
WORKDIR /src

# 3. copy package files
COPY package.json ./

# 4. install dependencies
RUN npm install

# 5. copy source code
COPY . .

ENV PORT=8081

# 6. expose port
EXPOSE 8081

# 7. start the application
CMD ["npm", "start"]