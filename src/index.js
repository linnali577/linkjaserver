const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: "link-x",
    url: "www.hotographx.com",
    description: "this is not valid link",
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of linkja`,

    feed: () => links,

    link: (parent, args) => {
      return links.find((x) => x.id === args.id) || {};
    },
  },

  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      let link = links.find((x) => x.id === args.id);
      link.url = args.url;
      link.description = args.description;
      return link;
    },

    deleteLink: (parent, args) => {
      let link = links.find((x) => x.id === args.id);
      links = links.filter((x) => x.id !== args.id);
      return link;
    },
  },

  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
