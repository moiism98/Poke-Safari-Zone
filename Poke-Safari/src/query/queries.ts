import { gql } from "@apollo/client"

export const GET_ALL_POKEMON = gql`
query pokemons($limit: Int, $offset: Int) {
  pokemons(limit: $limit, offset: $offset) {
    results
    {
      id
      name
    }
  }
}
`

export const GET_POKEMON = gql`
query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    weight
    height
    sprites {
      front_default
      front_shiny
    }
    moves {
      move {
        name
      }
    }
    types {
      type {
        name
      }
    }
    abilities{
      ability{
        name
      }
    }
    held_items{
      item{
        id
        name
        url
      }
    }
    stats {
      stat{
        name
      }
      base_stat
      effort
    }
  }
}`