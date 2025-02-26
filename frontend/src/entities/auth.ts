export interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
}
export interface IRegisterAvatar {
  avatar: string;
}
export interface ILoginForm {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;          // Añadido para manejar el estado de la respuesta
  access_token: string;
  user: IUserProfile;
  error?: string;           // Añadido para manejar mensajes de error
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  registrationDate: string;
  token: string;
}
