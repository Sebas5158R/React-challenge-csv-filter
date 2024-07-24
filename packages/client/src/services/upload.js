export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`http://localhost:3001/api/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) return [ new Error(`Error uploading the file: ${res.statusText}`) ];

        const json = await res.json();
        return [ null, json.data ];

    } catch (error) {
        if (error instanceof Error) return [ error ];
    }

    return [ new Error("Unknown error") ];
}