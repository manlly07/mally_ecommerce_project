export class LoginType {
    email: string;
    password: string;
    user_agent: string | null;
    user_login_ip: string | null;
}

export class UserTokenType {
    user_id: string;
    user_refresh_token: string;
    user_private_key: string;
    user_public_key: string;
    user_login_ip: string;
    user_agent: string;
    expiration: Date;
}