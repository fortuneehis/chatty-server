

class Connections<K, V> {

    activeConnections: Map<K, V> = new Map()

    add(key: K, value: V): void {
        this.activeConnections.set(key, value)
    }

    exists(key: K): boolean {
        return this.activeConnections.has(key)
    }

    find(key: K): V | undefined {
        return this.activeConnections.get(key)
    }

    keys(): K[] {
        return Array.from(this.activeConnections.keys())

    }

    remove(key: K): void {
        this.activeConnections.delete(key)
    }


}

const connection = new Connections<number, string>()

export default connection