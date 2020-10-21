import React, { useState, useEffect, FC } from "react";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import "./App.css";

export interface Movie {
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
    castMembers: CastMember[];
    crewMembers: CrewMember[];
    externalId: number;
    overview: Overview[];
    popularity: number;
    poster: Poster;
    releaseDate: string;
    slug: Slug;
    title: string;
}

export interface CastMember {
    _key: string;
    _type: CastMemberType;
    characterName: string;
    externalCreditId: string;
    externalId: number;
    person: Asset;
}

export enum CastMemberType {
    CastMember = "castMember",
}

export interface Asset {
    _ref: string;
    _type: AssetType;
}

export enum AssetType {
    Reference = "reference",
}

export interface CrewMember {
    _key: string;
    _type: string;
    department: string;
    externalCreditId: string;
    externalId: number;
    job: string;
    person: Asset;
}

export interface Overview {
    _key: string;
    _type: string;
    children: Child[];
    markDefs: any[];
    style: string;
}

export interface Child {
    _key: string;
    _type: string;
    marks: any[];
    text: string;
}

export interface Poster {
    _type: string;
    asset: Asset;
    crop: Crop;
    hotspot: Hotspot;
}

export interface Crop {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

export interface Hotspot {
    height: number;
    width: number;
    x: number;
    y: number;
}

export interface Slug {
    _type: string;
    current: string;
    source: string;
}




const SanityConfig = {
    projectId: "xegaktwh",
    dataset: "production",
    token: "", // or leave blank to be anonymous user
    useCdn: false, // `false` if you want to ensure fresh data
};

const createClient = require("@sanity/client");

const sanityClient = createClient(SanityConfig);
const builder = imageUrlBuilder(SanityConfig);

const urlFor = (source: Poster) => builder.image(source);

const App: FC = () => {
    const [data, setData] = useState<Movie[]>([]);

    const fetchDataFromSanity = async () => {
        const data = await sanityClient.fetch(
            groq`*[_type == "movie"] { popularity, castMembers, poster, slug, title }`
        );
        setData(data);
    };

    useEffect(() => {
        fetchDataFromSanity();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                {/* <pre style={{ fontSize: 12, textAlign: "left", width: "100%" }}>
                    {JSON.stringify(data, null, 2)}
                </pre> */}
                <h1>Movies</h1>
                <div className="movie-grid">
                    {data.map(({ title, poster, popularity, castMembers }) => (
                        <Movie
                            title={title}
                            poster={poster}
                            popularity={popularity}
                            castMembers={castMembers}
                        />
                    ))}
                </div>
            </header>
        </div>
    );
};

type MovieProps = {
    title: string;
    poster: Poster;
    popularity: number;
    castMembers: CastMember[];
};

const Movie: FC<MovieProps> = ({ title, poster, popularity, castMembers }) => {
    const posterURL = urlFor(poster).auto("format").url();
    return (
        <div className="movie-container">
            <h2>{title}</h2>
            <p>{popularity}</p>
            <div className="movie-poster">
                <img style={{ width: "100%" }} src={posterURL || ""} />
            </div>
        </div>
    );
};

export default App;
