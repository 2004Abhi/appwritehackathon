import { Client, Databases } from "appwrite";
import { REACT_APP_PROJECT_ID } from "../utils/impdata";

export const client = new Client();
export const database = new Databases(client);

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(REACT_APP_PROJECT_ID);