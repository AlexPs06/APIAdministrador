'use strict'
const User = use('App/Models/User')
const fs = require('fs').promises
const fs2 = require('fs')
const path = require('path')
class AdmiController {
      // creating and saving a new user (sign-up)
    async store ({ request, response }) {
        try {
            // getting data passed within the request
            const data = request.only(['username', 'email', 'password'])
            console.log(("llegue"));
            
            // looking for user in database
            const userExists = await User.findBy('email', data.email)

            // if user exists don't save
            if (userExists) {
            return response
                .status(400)
                .send({ message: { error: 'User already registered' } })
            }
            // if user doesn't exist, proceeds with saving him in DB
            const user = await User.create(data)

            return response.status(201).json(user)
        } catch (err) {
            return response
            .status(err.status)
            .send(err)
        }
    }

    async index({response}){
        let users = await User.all()
        return response.json(users);
    }

    async getFiles({request, response}){
        const token = request.only(['token'])
        var data = []//C:\\Users\\luis_\\Documents\\Maestria\\inteligencia artificial\\CHATBOT-T\\api\\admin\\apiAdmin\\
        const directoryPath = "archivosAIML"

        try {
            var ls=fs2.readdirSync(directoryPath);

            for (let index = 0; index < ls.length; index++) {
                
                const file = path.join(directoryPath, ls[index]);
                var dataFile =null;
                try{
                    dataFile = fs2.lstatSync(file);
                }catch(e){
                    return response
                    .status(err.status)
                    .send(err)
                }
                if(dataFile){
                    data.push({
                        path: file,
                        isDirectory: dataFile.isDirectory(),
                        length: dataFile.size,
                        name: ls[index]
                    });
                }
            }

            return response.json(data);
            

        } catch (err) {
            return response
            .status(err.status)
            .send(err)
        }
    }
    async openFile({request, response}){
        const temp = request.only(['token', 'path'])
            try {
                const data = await fs.readFile(temp.path);
                return response.send(data.toString())
            } catch (error) {
                return response
                .status(error.status)
                .send(error)
            }
            
    }

    async uploadFile({request, response}) {
        const temp = request.only(['token','path','content' ])
        console.log(temp);
        try {
            fs.writeFile(temp.path,temp.content, function (err, data){
                    if(err){
                        return response.status(err.status).send(err)
                    }
                    return response.status(201).send("bien")
                    

            }).catch(error =>{
                return response.status(error.status).send(error)
            }) 
        } catch (error) {
            return response.status(error.status).send(error)
        }

    }


}

module.exports = AdmiController
