const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Post{
        _id: ID!
        title: String!
        content: String!        
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String!       
        posts: [Post!]!
    }
    
    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!        
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(): PostData!
        post(id: ID!): Post!
    }
    type RootMutation {
        signUp(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `);
