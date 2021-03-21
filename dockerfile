from node:12.16.3-buster

run apt-get update

run mkdir dourent
workdir dourent
add dist dist 
add server.js server.js
add package.json package.json
run npm install --production

EXPOSE 8000
CMD ["npm","run","server"] 
