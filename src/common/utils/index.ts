export const replacePlaceHolder = (template: string, params: object) => {
    let result = template

    Object.keys(params).forEach( key => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), params[key])
    })

    return result
}