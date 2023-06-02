import { Client, Databases } from "appwrite";


export const client = new Client();
export const database = new Databases(client);

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.REACT_APP_PROJECT_ID);