# CU-Bytes Endpoints Summary

Summary of endpoints.

## Table Of Contents

- [CU-Bytes Endpoints Summary](#cu-bytes-endpoints-summary)
  - [Table Of Contents](#table-of-contents)
    - [Login](#login)
    - [Register](#register)


### Login

    """
    POST /login

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Responses:
    201 Success - User logged in successfully
    400 Bad Request - Wrong username or password
    """

### Register

    """
    POST /register

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Restrictions:
    Usernames must be between 1 and 80 characters, unique, and can
    only contain letters, numbers, underscores and spaces
    Passwords must be between 10 and 120 characters, with at least
    one special character, one number, one uppercase and one lowercase

    Responses:
    201 Success - User registered successfully
    400 Bad Request - Missing or invalid data
    409 Conflict - Username already exists
    """
