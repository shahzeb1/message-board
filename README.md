![markdown](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACnUlEQVR4Xu1a0VHDMAx9nQA2oEwAGwCTABPABsAGMAEwCbABTEC7AUwA9zirJ4wd20l6OI7807vWSfSepGdJzQIzX4uZ44cRYBEwcwYsBWYeACaClgKWAjNnwFJABcAugAsAZwCWjQbGCsADgDsAH8QoEXAI4AkASZjDIvgTAK8kgKDfZwReHEwS9knANYCrObg9gPGGBND7OucfnQ60yAnz/1QBW5GALw9p6yfDL7xGgEWApYBpQK4I+vtEO89ddZVzarDKvI9szBXfmB29ri8RwdiDN1VVgoFUtdkLgHpmr+vHIIA2vLrS8qe+DixWmyy1SUJs9QJQCwG0g0UG0yG0GPYM/641eQIILqQHXXmvCWmCAF8PUnnfBAGfAHYUEtEDfuXnvb+3CQIY9v7RRj3g8vM+tFdImGwK0HC/ywqJnXSZo57jNZwCMlR5BnAQkfk3AMduDNUkAcRNwSMJWg/4PfOe4KkNXLkE5ERV4mRFaLbRux3OMTx05PlHY859BNgQEmKDna0SIAWRTF2SHsjIYUbVUcrV3u8vLupCl22dAJa9NJpL8l4bUhIBvE7uF9MXH6TWm38hQPSAn5L3QwgoISEF/o8GjdEM5Z7fQkJpBMh1MZGV332xjWXN1lMgla59CSg5abpsmDQBoisssfXivzyiO0UOmFIKaGD6uC2ZSE1aA3zPSp8hfUfK80ENKomA3AfUvq+3BtQOLNc+I0AzZSlgf40BfG1kT4VF13Q3N89q3edPp9f2goTrthgF/iCjVi+OZRd7h6V+SSo0zRnrYbXdZ9M46U6Offelm+RqTajN+CH2rN0A99Z/TW7ITSd9bWkvP2mwIeONgOZcWgjIIqCQsOa2WwQ059JCQBYBhYQ1t90ioDmXFgL6BtBAvwICKAl8AAAAAElFTkSuQmCC "markdown") 
# Message Board. 


This project contains a message board which allows users to post markdown enabled comments witin various communities (similar to subreddits). This project is built to help you get started with AWS CodeStar. It contains everything you'd need to get started with a realistic Node.js application.

![Message board screenshot](messageboard-1.png "Message board screenshot")

Technology Used
----------

* [Express.js](expressjs.com) - The server which handles all the post requests for content. 
* [Redis](https://redis.io) - Caching and displaying the data for the chart.
* [DynamoDB](https://aws.amazon.com/dynamodb/) - Storing all the messages on the board.

Folder Structure
-----------

* `.ebextensions/` - Contains the configuration files that
  AWS Elastic Beanstalk will deploy your Express application.
* `package.json` - Contains various metadata and dependencies.
* `app.js` - The entrypoint for our express app.
* `public/` - Directory contains static web assets used by the application.


Getting Started Locally
---------------

These directions assume you want to develop on your local computer, and not
from the Amazon EC2 instance itself. If you are ready to deploy this to AWS,
then skip to the next section.

1. Install [Node.js](https://nodejs.org/en/download/) on your computer.  For details on available installers visit

2. Install NPM dependencies:

        $ npm install
3. Rename the `example.env` file to `.env` and place your `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`,`AWS_REGION`, 
and `REDIS_HOST` right after the respective `=` signs.

4. Make sure you have [redis installed](https://redis.io/topics/quickstart) locally. Use the `redis-server`
command to run a redis server on your localhost.

5. Create a DynamoDB table called `messages`.

6. Start the development server:

        $ node app.js

7. Open `http://127.0.0.1:3000/` in a web browser to view your application.

Deploying to AWS using CodeStar
------------------

(instructions coming soon)