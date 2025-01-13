import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import MainPage from 'components/headerCategories/MainPage';
import { ScrollView } from 'react-native-gesture-handler';

const categories = [
  { name: 'Sur Mesures', icon: 'nature-people' },
  { name: 'Croisières', icon: 'home' },
  { name: 'Famille', icon: 'people' },
  { name: 'Honeymoon', icon: 'local-fire-department' },
  { name: 'Plages', icon: 'videogame-asset' },
  { name: 'Ski', icon: 'apartment' },
];

interface Props {
  onCategoryChanged: (category: string) => void;
  onSearchChanged: (label: string) => void;
}

const ExploreHeader = ({ onCategoryChanged, onSearchChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  type TouchableOpacityRef = React.ElementRef<typeof TouchableOpacity>;
  const itemsRef = useRef<Array<TouchableOpacityRef | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    if (!selected) return;
    setActiveIndex(index);

    selected.measure?.((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: pageX - 16, y: 0, animated: true });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  const handleSearchSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    onSearchChanged(searchQuery);
  };

  return (
    <View style={{ backgroundColor: '#555', zIndex: 1000 ,paddingTop:30}}>
      <MainPage onSearchChanged={handleSearchSubmit} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contHeader}>
          <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
    
            <TouchableOpacity
              ref={(el) => (itemsRef.current[0] = el)}
              key={0}
              style={activeIndex === 0 ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(0)}
            >
              <MaterialIcons
                name={'nature-people'}
                size={24}
                color={activeIndex === 0 ? '#fff' : '#777'}
              />
              <Text style={activeIndex === 0 ? styles.categoryTextActive : styles.categoryText}>
                Sur Mesures
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={(el) => (itemsRef.current[1] = el)}
              key={1}
              style={activeIndex === 1 ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(1)}
            >
              <MaterialIcons
                name={'home'}
                size={24}
                color={activeIndex === 1 ? '#fff' : '#777'}
              />
              <Text style={activeIndex === 1 ? styles.categoryTextActive : styles.categoryText}>
                Croisières
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={(el) => (itemsRef.current[2] = el)}
              key={2}
              style={activeIndex === 2 ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(2)}
            >
              <MaterialIcons
                name={'people'}
                size={24}
                color={activeIndex === 2 ? '#fff' : '#777'}
              />
              <Text style={activeIndex === 2 ? styles.categoryTextActive : styles.categoryText}>
                Famille
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={(el) => (itemsRef.current[3] = el)}
              key={3}
              style={activeIndex === 3 ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(3)}
            >
              <MaterialIcons
                name={'local-fire-department'}
                size={24}
                color={activeIndex === 3 ? '#fff' : '#777'}
              />
              <Text style={activeIndex === 3 ? styles.categoryTextActive : styles.categoryText}>
                Honeymoon
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={(el) => (itemsRef.current[4] = el)}
              key={4}
              style={activeIndex === 4 ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(4)}
            >
              <MaterialIcons
                name={'videogame-asset'}
                size={24}
                color={activeIndex === 4 ? '#fff' : '#777'}
              />
              <Text style={activeIndex === 4 ? styles.categoryTextActive : styles.categoryText}>
                Plages
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={(el) => (itemsRef.current[5] = el)}
              key={5}
              style={activeIndex === 5 ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(5)}
            >
              <MaterialIcons
                name={'apartment'}
                size={24}
                color={activeIndex === 5 ? '#fff' : '#777'}
              />
              <Text style={activeIndex === 5 ? styles.categoryTextActive : styles.categoryText}>
                Ski
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#222',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contHeader: {
    backgroundColor: '#222',
    height: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 10 },
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollViewContent: {
    alignItems: 'center',
    gap: 30,
    paddingHorizontal: 16,
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

export default ExploreHeader;
