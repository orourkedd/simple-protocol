## What is simple protocol?

Simple protocol is *simple*:  
1) Never intentionally throw exceptions / always return with a 200 status code.  
2) Return a valid JSON object like this for a success:
```
{
  success: true,
  payload: {
    // the result of the operation, i.e. an http response body
  }
}
```
3) Return a valid JSON object like this for an error:
```
{
  success: false,
  error: {
    // error details or object
  }
}
```
That's it!  Both success and error cases are handled the same way and can follow the same code path.
