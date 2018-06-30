# Blog API

## Notes

- If you find yourself writing the same functionality twice, such as the check for missing fields in both endpoints, this is a good candidate for refactoring. You could either make an easy helper function you can drop in to both, or in my example, I created a reusable middleware that can be used anywhere in your application.
- Refactored logic for checking required fields no not use a for loop.
  - refactoring is not just for semantics. It helps us to debug and reason about our code. If we neex to update the functionality, we have a single source of truth. However, if we use the same chunk of code in multiple places, we have to update and edit all of them if we need to refactor or extend the function.
- Practical example of what is known as currying, which allows us to pass argumuments for a function in one at a time, the result of which is another function that will take the next argument. Currying is used here in the helper function checkFields to let us create a function that will give us a function to check multiple endpoints. Also used to create a middleware that can be used for different field requirements on endpoints.
- required fields on put endpoint should include the id that is being chcked for.
- json parser can be put in the main server flow as middleware before any endpoint is hit.
