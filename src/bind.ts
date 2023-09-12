export function bind() {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        if (typeof originalMethod !== "function") {
            throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
        }

        return {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                Object.defineProperty(this, propertyKey, {
                    value: boundFn,
                    configurable: true,
                    writable: true,
                });
                return boundFn;
            },
        };
    };
}