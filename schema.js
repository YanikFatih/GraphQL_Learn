const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull, //mutlaka bu alan eklenmek zorunda


} = require('graphql')

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        employee:{
            type: EmployeeType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                //accessing data
                // for (let i = 0; i < employees.length; i++){
                //     if (employees[i].id === args.id){
                //         return employees[i];
                //     }
                // }
                return axios.get('http://localhost:3000/employees/' + args.id).
                then(res => res.data);
            }
        },
        employees:{
            type: new GraphQLList(EmployeeType),
            resolve(parent, args) {
                //return employees;
                return axios.get('http://localhost:3000/employees/').
                then(res => res.data);
            }
        }
        //RootQuery içerisinde 2 farklı query yazdık
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addEmployee:{
            type: EmployeeType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)}, //yani boş geçilemez bir string değer olmalı
                email:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}  
            },
            resolve(parent, args) {
                return axios.post('http://localhost:3000/employees', {
                    name:args.name,
                    email:args.email,
                    age:args.age
                }).then(res => res.data)
            }
        },

        deleteEmployee:{
            type:EmployeeType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) { 
                return axios.delete('http://localhost:3000/employees/' + args.id).
                then(res => res.data)
            }
        },
        updateEmployee:{
            type:EmployeeType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                name:{type: GraphQLString}, //yani boş geçilemez bir string değer olmalı
                email:{type:GraphQLString},
                age:{type:GraphQLInt},
            },
            resolve(_, args) {
                return axios.patch('http://localhost:3000/employees/' + args.id, args)
                .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery, //RootQuery ile birden fazla query kullanabiliyoruz
    mutation:mutation
})