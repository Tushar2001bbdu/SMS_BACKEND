# Use the AWS Lambda Node.js runtime as a parent image
FROM public.ecr.aws/lambda/nodejs:18

# Set the working directory inside the container
WORKDIR /var/task

# Copy application files into the container
COPY . .

# Install dependencies
RUN npm install

# Specify the handler (your entry point)
CMD ["server.handler"]

