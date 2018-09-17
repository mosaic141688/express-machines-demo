module.exports = {
    identity: 'do-something',
    inputs: {
        foo: { type: 'string', required: true }
    },
    exits:{
        fail:{

        }
    },
    fn: function(inputs, exits){
        let result = `The result, based on ${inputs.foo}.`;
        return exits.success(result);
    }
};