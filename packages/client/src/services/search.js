export const searchData = async (search) => {
    try {
        const res = await fetch(`http://localhost:3001/api/users?q=${search}`);

        if (!res.ok) return [ new Error(`Error searching data: ${res.statusText}`) ];

        const json = await res.json();
        return [ null, json.data ];

    } catch (error) {
        if (error instanceof Error) return [ error ];
    }

    return [ new Error("Unknown error") ];
}