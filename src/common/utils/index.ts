import { JwtService } from "@nestjs/jwt"

export const replacePlaceHolder = (template: string, params: object) => {
    let result = template

    Object.keys(params).forEach( key => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), params[key])
    })

    return result
}

export const generateToken = async (data: any, key: string, expire: string) => {
    return await new JwtService({ secret: key }).signAsync(data, {
        expiresIn: expire
    })
}

export const getSelectData = (select: Array<string>) => {
    return Object.fromEntries(select.map( field => [field, true]));
}

export const unGetSelectData = (select: Array<string>) => {
    return Object.fromEntries(select.map( field => [field, false]));
}

export const getSelectDataFromObject = (select: object, params: Array<string>) => {
    return Object.fromEntries(params.map( field => [field, select[field] || '']));
} 

export const unGetSelectDataFromObject = (select: object, params: Array<string>) => {
    const newObject = { ...select };
    
    params.forEach(field => {
        delete newObject[field];
    });
    
    return newObject;
}