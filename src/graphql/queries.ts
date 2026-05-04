import { gql } from '@apollo/client';

export const CHARACTERS_QUERY = gql`
  query Characters($page: Int) {
    characters(page: $page) {
      info {
        next
        pages
      }
      results {
        id
        name
        image
        species
        episode {
          id
        }
      }
    }
  }
`;

export const CHARACTER_QUERY = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id
      name
      image
      species
      status
      gender
      type
      location {
        name
      }
      origin {
        name
      }
      episode {
        id
      }
    }
  }
`;
