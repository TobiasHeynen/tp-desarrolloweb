// POST /auth/login
export interface LoginPeticion {
    documento: string;
    clave: string;
}

export interface LoginRespuesta {
    accessToken: string;
}
