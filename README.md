# package.sam

## Who?

package.sam is a funny app developed with the idea to have some fun about how a simple word like `package` can be so powerful. This app is created by the team Kasaromi, *Ka* - @katbow, *sa* - @shouston3, *ro* - @RobStallion and *mi* - @MyPitit.

## What

In to this weeks project our goal is to learn about `Authentication`.

We are going to use Twitter [`OAuth`](https://dev.twitter.com/oauth), to authenticate the user through Twitter.

We are going to host our app on [Heroku](https://www.heroku.com/).

## How

We create a user session, storing a JWT (so that the naked access token isn't being transferred across insecure http) in a cookie.

### Plugins we will be using:

* [url](https://nodejs.org/api/url.html) and [querystring](https://nodejs.org/api/querystring.html) for easy parsing of requests
* [hapi](http://hapijs.com/) as our node framework
* [handlebars](handlebarsjs.com) for modularizing the code

### What will be sent where

An ajax request will be sent from the front to the server in the form: '/date=d&username=user&tweet=tw'

tbc tomorrow...

### This is what our application is going to look like:

+ This is the login page

![img1](https://cloud.githubusercontent.com/assets/2573931/13614753/ebc48bf6-e569-11e5-90d6-03fbc7c46155.png)

+ Once the user is logged in, they will be able to send Tweets to @PackageSam

![img2](https://cloud.githubusercontent.com/assets/2573931/13614754/ebd9b58a-e569-11e5-9e2a-b7360fe37c10.png)


## Stretch goals

+ Use a database `redis` to store some user credentials .
+ Integrate a second `API`.

### Also...

Feel free to follow @PackageSam on Twitter :smile:
