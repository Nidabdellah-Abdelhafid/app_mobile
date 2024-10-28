import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import MainPage from 'components/headerCategories/MainPage';
import { ScrollView } from 'react-native-gesture-handler';

const categories = [
    {
      name: 'Sur Mesures',
      icon: 'nature-people',
    },
    {
      name: 'Croisières',
      icon: 'home',
    },
    {
      name: 'Famille',
      icon: 'people',
    },
    {
      name: 'Honeymoon',
      icon: 'local-fire-department',
    },
    {
      name: 'Plages',
      icon: 'videogame-asset',
    },
    {
      name: 'Ski',
      icon: 'apartment',
    }
  ];
  
interface Props {
    onCategoryChanged: (category: string) => void;
    onSearchChanged: (label: string) => void;
  
}
const ExploreHeader = ({ onCategoryChanged,onSearchChanged }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);
  
    const selectCategory = (index: number) => {
        const selected = itemsRef.current[index];
        if (!selected) {
          console.error('Selected item is invalid');
          return;
        }
        setActiveIndex(index);
        selected.measure((x, y, width, height, pageX, pageY) => {
          scrollRef.current?.scrollTo({ x: pageX - 16, y: 0, animated: true });
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCategoryChanged(categories[index].name);
      };

      
      const handleSearchSubmit = (searchQuery) => {
        // Call the onSearchChanged prop to pass the searchQuery to HomePage
        onSearchChanged(searchQuery);
    };
    return (
      <View style={{backgroundColor: '#555',zIndex: 1000,}}>

      <MainPage onSearchChanged={handleSearchSubmit}/>

      <SafeAreaView style={{ backgroundColor: '#222',
            borderTopLeftRadius:30,
            borderTopRightRadius:30,}}>
        
        <View style={styles.contHeader}>
          <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              gap: 30,
              paddingHorizontal: 16,
            }}>
              
            {categories.map((item, index) => (
              <TouchableOpacity
                ref={(el) => (itemsRef.current[index] = el)}
                key={index}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                onPress={() => selectCategory(index)}>
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={activeIndex === index ? '#fff' : '#777'}
                />
                <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    contHeader:{
            backgroundColor: '#222',
            height: 80,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: {
                width: 1,
                height: 10,
            },
            borderTopLeftRadius:30,
            borderTopRightRadius:30,
        },
    categoryText: {
        fontSize: 14,
        color: '#777',
      },
      categoryTextActive: {
        fontSize: 14,
        color: '#fff',
      },
      categoriesBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
      },
      categoriesBtnActive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        paddingBottom: 8,
      }, 
});

export default ExploreHeader