import { useEffect, useState } from "react";
import { searchData } from "../services/search";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";

const DEBOUNCE_TIME = 500;

export const Search = ({ initialData }) => {

    const [data, setData] = useState(initialData);
    const [search, setSearch] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('q') ?? '';
    });
    const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        const newPathName = debouncedSearch === ''
            ? window.location.pathname : `?q=${debouncedSearch}`;

        window.history.replaceState({}, '', newPathName);
    }, [debouncedSearch]);

    useEffect(() => {
        if (!debouncedSearch) {
            setData(initialData);
            return;
        }
        // Call the service to search the data
        searchData(debouncedSearch)
            .then(res => {
                const [err, newData] = res;
                if (err) {
                    toast.error(err.message);
                    return;
                }

                if (newData) setData(newData);
            })
    }, [debouncedSearch, initialData]);

    return (
        <div className="search">
            <h1>Search</h1>
            <form>
                <input type="search" placeholder="Search" onChange={handleSearch} defaultValue={search} />
            </form>
            <ul>
                {
                    data.map((row) => (
                        <li key={row.ID}>
                            <article>
                                {Object
                                    .entries(row)
                                    .map(([key, value]) =>
                                        <p key={key}>
                                            <strong>{key}:</strong>
                                            {value}
                                        </p>
                                    )}
                            </article>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}