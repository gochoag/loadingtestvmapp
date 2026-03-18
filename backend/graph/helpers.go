package graph

func toPointers[T any](items []T) []*T {
	pointers := make([]*T, 0, len(items))
	for index := range items {
		item := items[index]
		pointers = append(pointers, &item)
	}

	return pointers
}
