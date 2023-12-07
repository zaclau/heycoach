async function graphQLFetch(query, variables = {}) {
    try {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        console.log(body);
        const result = JSON.parse(body);
        /*
        Check for errors in the GraphQL response
        */
        if (result.errors) {
          const error = result.errors[0];
          if (error.extensions.code == 'BAD_USER_INPUT') {
            const details = error.extensions.exception.errors.join('\n ');
            throw new Error(`${error.message}:\n ${details}`);
          } else {
            throw new Error(`${error.extensions.code}: ${error.message}`);
          }
        }
        return result.data;
    } catch (e) {
        throw new Error(`${e.message}`);
    }
}

module.exports = { graphQLFetch };