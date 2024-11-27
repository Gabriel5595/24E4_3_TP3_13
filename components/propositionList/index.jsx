import React, { useState, useEffect } from 'react';
import { FlatList, Text, ActivityIndicator, View, StyleSheet, RefreshControl } from 'react-native';

const PropositionsList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPropositions = async (reset = false) => {
    if (loading && !reset) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes?pagina=${reset ? 1 : page}&itens=10`
      );
      const json = await response.json();
      setData((prevData) => (reset ? json.dados : [...prevData, ...json.dados]));
      if (reset) {
        setPage(2);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Erro ao buscar proposições:', error);
    } finally {
      setLoading(false);
      if (reset) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPropositions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPropositions(true);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={styles.loading} />;
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.ementa || 'Sem título'}</Text>
          <Text style={styles.subtitle}>ID: {item.id}</Text>
        </View>
      )}
      onEndReached={() => fetchPropositions(false)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#2196f3']}
          tintColor="#2196f3"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  loading: {
    marginVertical: 16,
  },
});

export default PropositionsList;
