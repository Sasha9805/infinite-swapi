import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
	const response = await fetch(url);
	return response.json();
};

export function InfiniteSpecies() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isPending,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: ["sw-species"],
		queryFn: ({ pageParam }) => fetchUrl(pageParam),
		initialPageParam: initialUrl,
		getNextPageParam: (lastPage) => lastPage.next,
	});

	if (isPending) {
		return <div className="loading">Loading...</div>;
	}

	if (isError) {
		return <div>Error! {error.toString()}</div>;
	}

	return (
		<>
			{isFetching && <div className="loading">Loading...</div>}
			<InfiniteScroll
				initialLoad={false}
				loadMore={() => {
					if (!isFetching) {
						fetchNextPage();
					}
				}}
				hasMore={hasNextPage}
			>
				{data.pages.map((pageData) => {
					return pageData.results.map((species) => {
						return (
							<Species
								key={species.name}
								name={species.name}
								language={species.language}
								averageLifespan={species.average_lifespan}
							/>
						);
					});
				})}
			</InfiniteScroll>
		</>
	);
}
