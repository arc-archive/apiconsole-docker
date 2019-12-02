FROM launcher.gcr.io/google/nodejs
# Copy project files to the image working directory
COPY . /app/
# Installs project PROD dependencies
RUN npm --unsafe-perm install
# # Runs API model generation process. API_PROJECT variable must be set for this
# # to succeed.
# RUN node tasks/prepare-model.js
# Runs the server with the console.
CMD ["npm","start"]
