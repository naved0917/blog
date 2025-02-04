export enum ApiMethods {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT'
};

export enum Toaster {
    SUCCESS = 'Success',
    WARNING = 'Warning',
    INFO = 'Information',
    ERROR = 'Error',
    REQUIRED = 'Required',
};

export const LOGIN_MENU_LIST = [
    { path: '/private/dashboard', title: 'Dashboard' },
];

export const WITHOUT_LOGIN_MENU_LIST = [
    { path: '/home', title: 'Home', },
    { path: '/auth/login', title: 'Login' },
];

export const ERROR_MESSAGE = 'Something Went Wrong.';
export const SESSION_EXPIRED = 'The Session has Expired. Please Login Again.';
export const REQUIRED_FIELDS = "Please fill all the required fields.";
export const LOGIN_SUCCESSFULLY = 'Login Successfully.';