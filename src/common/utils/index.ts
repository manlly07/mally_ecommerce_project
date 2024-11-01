import { JwtService } from "@nestjs/jwt"
import { SetMetadata } from '@nestjs/common';

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


export const updateNestedObjectParser = (obj: object) => {
    const final = {}

    Object.keys(obj).forEach( k => {
        if( typeof obj[k] === 'object' && !Array.isArray(obj[k]) ) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach( a => {
                final[`${k}.${a}`] = response[a]
            })
        }else {
            final[k] = obj[k]
        }
    })

    return final
}

export const updateNestedArrayParser = (obj: any) => {
    const flattenedData = obj.user_roles.flatMap(userRole =>
        userRole.role.role_permissions.map(permission => ({
          role_name: userRole.role.role_name,
          user_id: obj.id,
          role_id: userRole.role_id,
          permission_id: permission.permission_id,
          permission_name: permission.permission.permission_name,
        }))
    );
    
    return flattenedData
}

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
