export class LoginType {
    email: string;
    password: string;
    user_agent: string & '';
    user_login_ip: string & '';
}

export class UserTokenType {
    user_id: number;
    user_refresh_token: string;
    user_private_key: string;
    user_public_key: string;
    user_login_ip: string;
    user_agent: string;
    expiration: Date;
}