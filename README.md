# errbuddy

# Deployment

## Option 1: using docker
The quickest and easiest way is do use the docker-compose file that comes with this repo 

### First time starter
```
git clone https://github.com/peh/errbuddy.git
cd errbuddy
echo MYSQL_PASSWORD=i-changed-this > .env
docker-compose up
```

You should now be able to point your Browser to http://localhost:9000 and login with username `admin` and password `admin`.
To Change the URL the app is using you can add `SERVER_URL=https://errbuddy.company.com` to `.env`.

This way all needed Databases are started in docker.

### Upgrading

```
git pull
docker-compose restart app
```

The app takes care of updating DB schemes.

## Option 2: runnable jar

### Preparation

#### Setup
You will need to install and configure:
* mysql/mariadb
* elasticseach *version 1.7.x*
* redis
* java8

#### Configuration
Download the example configuration from https://github.com/peh/errbuddy/blob/master/default-config.groovy and align the Database configuration to your need
e.g.
```
String mysqlHost = "127.0.0.1"
String mysqlDatabase = "errbuddy"
String mysqlUser = "errbuddy"
String mysqlPassword = "123345"
String redisHost = "127.0.0.1"
String redisPort = "6379"
String elasticsearchHost = "127.0.0.1"
String elasticsearchPort = "9300" // it is important to use the transport port of elasticsearch and not the http api!
```

#### Application Startup
Download the latest war from [Releases](https://github.com/peh/errbuddy/releases) and start the war with:

```
java -jar -Dgrails.env=production -Derrbuddy.config.location=/path/to/config.groovy errbuddy-2.x.x.war
```


## Option 3: deploy it to a Appserver (At your own risk)
The recommended Appserver for errbuddy is tomcat8. It might work on other appservers to but it is untested so far! 

#### Setup
See Option 2 for general Database setup needed

#### Create Warfile
* Clone the repo `git clone https://github.com/peh/errbuddy.git`
* in build.gradle change `compile "org.springframework.boot:spring-boot-starter-tomcat"` to `provided "org.springframework.boot:spring-boot-starter-tomcat"`
* if you have build the project before: `rm -f .asscache && rm -f build/`
* run `./gradlew -Dgrails.babel.node.path=.nodejs/node-v7.4.0-linux-x64/bin/node -Dgrails.env=prod :clean :npmInstall :assetCompile :package`
* you might have to adjust the node path depending on your system. If you are on macOS it would be `.nodejs/node-v7.4.0-linux-x64/bin/node`. You can find out what to use here by first just running `./gradlew npmSetup` and then check what's in `./.nodejs/` 
* you will find the created warfile in `./builds/libs`
* Follow the instructions in configuration step of Option 2
* move the aligned config.groovy to `/opt/errbuddy/errbuddy.groovy`
* Deploy the warfile into your application server
