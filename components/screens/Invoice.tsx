import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const Invoice = () => {
  const viewRef = useRef();
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

  const itemsf = [
    { description: 'Item goes here', price: 100, qty: 2 },
    { description: 'Item goes here', price: 200, qty: 3 },
    // other items...
  ];

  const total = itemsf.reduce((sum, item) => sum + item.price * item.qty, 0);

  const saveInvoice = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.containerf}>
        {!isInvoiceVisible && (
        <View ref={viewRef} style={styles.invoicef} >
        <View style={styles.headerf}>
          <Text style={styles.headerTextf}>Atlas voyages</Text>
          <Text style={styles.headerSubTextf}>Invoice</Text>
          <Text style={styles.invoiceNumberf}>N° 123</Text>
          <Text style={styles.invoiceDatef}>MM/DD/YEAR</Text>
        </View>
        <View style={styles.contactInfof}>
          <Text style={styles.contactTextf}>Atlas voyages, n°3</Text>
          <Text style={styles.contactTextf}>(212) 529 001 002</Text>
          <Text style={styles.contactTextf}>https://atlasvoyages.com</Text>
        </View>
        <Card style={styles.cardf}>
          <Card.Content>
            <Title>Product</Title>
            <View style={styles.itemHeaderf}>
              <Text style={styles.itemTextf}>Description</Text>
              <Text style={styles.itemTextf}>Price</Text>
              <Text style={styles.itemTextf}>Qty</Text>
              <Text style={styles.itemTextf}>Total</Text>
            </View>
            {itemsf.map((item, index) => (
              <View key={index} style={styles.itemf}>
                <Text style={styles.itemTextf}>{item.description}</Text>
                <Text style={styles.itemTextf}>€{item.price.toFixed(2)}</Text>
                <Text style={styles.itemTextf}>{item.qty}</Text>
                <Text style={styles.itemTextf}>€{(item.price * item.qty).toFixed(2)}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
        <View style={styles.summaryf}>
          <Text style={styles.summaryTextf}>TOTAL: €{total.toFixed(2)}</Text>
        </View>
        <View style={styles.paymentInfof}>
          <Text style={styles.paymentTextf}>Payment Information</Text>
          <Text style={styles.paymentTextf}>Account: 1234 5678 9101 01</Text>
          <Text style={styles.paymentTextf}>Name: Jon Smith</Text>
        </View>
        <View style={styles.footerf}>
          <Text style={styles.footerTextf}>https://atlasvoyages.com</Text>
        </View>
      </View>)
        }
      
      <Button title="Save Invoice" onPress={saveInvoice} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerf: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  invoicef: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  headerf: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextf: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  headerSubTextf: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  invoiceNumberf: {
    fontSize: 16,
    color: '#000',
  },
  invoiceDatef: {
    fontSize: 16,
    color: '#000',
  },
  contactInfof: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactTextf: {
    fontSize: 16,
    color: '#000',
  },
  cardf: {
    marginBottom: 20,
  },
  itemHeaderf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  itemf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemTextf: {
    fontSize: 16,
    color: '#000',
  },
  summaryf: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  summaryTextf: {
    fontSize: 16,
    color: '#000',
  },
  paymentInfof: {
    borderWidth: 1,
    borderColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  paymentTextf: {
    fontSize: 16,
    color: '#000',
  },
  footerf: {
    alignItems: 'center',
  },
  footerTextf: {
    fontSize: 16,
    color: '#FF9800',
  },
});

export default Invoice;
