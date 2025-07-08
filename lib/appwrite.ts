import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.ks.foodordering",
    databaseId:'6868e3fd0032309afe35',
    bucketId: '686a5a95002da3fd0c13',
    userCollectionId: '6868e42c0003c2923a20',
    categoriesCollectionId: '6869ff5f00296051bcab',
    menuCollectionId: '686a000b000491ba09b3',
    customizationsCollectionId: '686a0135002412ff9d3c',
    menuCustomizationsCollectionId: '686a06190037e00e486f',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({email, password, name}:CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(),email,password,name)

        if (!newAccount) throw  Error;

        await signIn({email, password})

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {email, name, accountId: newAccount.$id, avatar: avatarUrl})



    } catch (e) {
        throw new Error(e as string)
    }

}

export const signIn = async ({email,password}:SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email,password);
    } catch(e){
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
    const currentAccount = await account.get()
        if (!currentAccount) throw  Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],

        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string)
    }
}

export const getMenu = async ({category, query}: GetMenuParams) => {
try {
    const queries: string[] = [];

    if(category) queries.push(Query.equal('categories',category));
    if (query) queries.push(Query.search('name',query));

    const menus = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries,
    )

    return menus.documents;
}catch (e) {
    throw new Error(e as string)
}
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,

        )

        return categories.documents;
    } catch(e) {
        throw new Error(e as string)
    }
}