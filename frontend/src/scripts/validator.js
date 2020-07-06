export const validator = rules => {
    const errors = []
    rules.forEach(rule => {
        if(!(rule.condition)) {
            errors.push(rule.message)
        }else{
            errors.splice(errors.indexOf(errors.find(error => error == rule.message)),0)
        }
    })
    if(errors.length === 0) {
        return {
            status: true,
        }
    }
    return {
        status: false,
        errors: errors.join('; ')
    }
}

// usually target is an input value

// rules is array of rules