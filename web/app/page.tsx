"use client";
import { useEffect, useState } from "react";

import { Container, Skeleton } from "@mui/material";

import InputCompleteTextField from "./components/InputCompleteTextField";
import TagAutocomplete from "./components/TagAutocomplete";
import { debounce } from './utils/debounce';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const MOCK_USER_ID = 1;
const MOCK_TAGS_ID = "default";
const API_PATH_TAGS_RECORD_USER = `tags_record_user/${MOCK_USER_ID}`;
const API_PATH_TAGS = `tags/${MOCK_TAGS_ID}`;

//  * AN EXAMPLE OF BASIC FETCH, I WILL NOT USE CUSTOM HOOK TO HANDLE HERE.
async function fetchTags(
  path: string = "",
  method: string = "GET",
  body: any = null
) {
  const options: any = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_ENDPOINT}/${path}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const tags = await response.json();
  return tags;
}

export default function Home() {
  const [tags, setTags] = useState<{ id: string; tag: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchTags(API_PATH_TAGS_RECORD_USER),
      fetchTags(API_PATH_TAGS),
    ])
      .then(([userTags, tags]) => {
        setLoading(false);
        setSelectedTags(userTags?.tags || []);
        setTags(tags?.tags || []);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  const handleSubmitTag = (_tags: string[]) => {
    const newTags = _tags
      .map((tag) => {
        const found = tags.find((_tag) => _tag.tag === tag);
        return !found && { id: Math.floor(Math.random() * 1000), tag };
      })
      .filter(Boolean);

    Promise.all([
      fetchTags(API_PATH_TAGS_RECORD_USER, "PUT", {
        id: MOCK_USER_ID,
        tags: _tags,
      }),
      fetchTags(API_PATH_TAGS, "PUT", {
        id: MOCK_TAGS_ID,
        tags: [...tags, ...newTags],
      }),
    ])
      .then(() => {
        console.info("Done!");
      })
      .catch((error) => console.error(error));
  };

  const debouncedHandleSubmitTag = debounce(handleSubmitTag, 300);

  if (loading)
    return (
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton variant="rectangular" width={320} height={40} />
      </Container>
    );

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TagAutocomplete
        tags={tags}
        defaultValue={selectedTags}
        handleTagSelection={debouncedHandleSubmitTag}
        renderInputCustom={(params) => (
          <InputCompleteTextField
            {...params}
            fullWidth
            label="Tags"
            placeholder="Type a tag and press Enter"
            style={{ minWidth: 250, maxWidth: 320}}
          />
        )}
      />
    </Container>
  );
}
