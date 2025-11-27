"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit2, Trash2, Tag, Briefcase, Save, X, Image, Hash, Heart } from "lucide-react"
import { toast } from "react-hot-toast"

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  userCount?: number
}

interface CategoryFormData {
  name: string
  description: string
  icon: string
  color: string
  tags: string
  isActive: boolean
}

const PREDEFINED_ICONS = [
  'Briefcase', 'Code', 'Palette', 'Stethoscope', 'Calculator', 'Camera', 
  'Music', 'Wrench', 'GraduationCap', 'Heart', 'Building', 'Car',
  'Plane', 'Coffee', 'Book', 'Gamepad2', 'Shirt', 'Home'
]

const PREDEFINED_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCounts, setLoadingCounts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: 'Briefcase', // Default icon for backend compatibility
    color: '#3B82F6', // Default color for backend compatibility
    tags: '',
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const data = await response.json()
      if (data.success) {
        const baseCategories: Category[] = data.categories
        setCategories(baseCategories)
        // Compute user counts after fetching categories
        computeUserCounts(baseCategories)
      } else {
        throw new Error(data.error || 'Failed to fetch categories')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const computeUserCounts = async (cats: Category[]) => {
    try {
      setLoadingCounts(true)
      const res = await fetch('/api/users', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch users for counts')
      const data = await res.json()
      const users: any[] = data.users || []
      const counts: Record<string, number> = {}
      users.forEach(u => {
        const categoryName = (u.category || '').trim()
        if (!categoryName) return
        counts[categoryName] = (counts[categoryName] || 0) + 1
      })
      setCategories(prev => prev.map(c => ({ ...c, userCount: counts[c.name] || 0 })))
    } catch (e) {
      console.error('Failed computing user counts:', e)
    } finally {
      setLoadingCounts(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const categoryData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      if (editingCategory) {
        // Update existing category
        const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(categoryData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update category')
        }
        
        const data = await response.json()
        if (data.success) {
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? data.category : cat
          ))
          toast.success('Category updated successfully')
        } else {
          throw new Error(data.error || 'Failed to update category')
        }
      } else {
        // Add new category
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(categoryData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create category')
        }
        
        const data = await response.json()
        if (data.success) {
          setCategories([data.category, ...categories])
          toast.success('Category created successfully')
        } else {
          throw new Error(data.error || 'Failed to create category')
        }
      }

      handleCloseModal()
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save category')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      tags: category.tags.join(', '),
      isActive: category.isActive
    })
    setShowModal(true)
  }

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }
      
      const data = await response.json()
      if (data.success) {
        setCategories(categories.filter(cat => cat.id !== categoryToDelete.id))
        toast.success('Category deleted successfully')
      } else {
        throw new Error(data.error || 'Failed to delete category')
      }
      
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete category')
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setCategoryToDelete(null)
  }

  const handleToggleStatus = async (categoryId: string) => {
    try {
      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update category status')
      }
      
      const data = await response.json()
      if (data.success) {
        setCategories(categories.map(cat => 
          cat.id === categoryId ? data.category : cat
        ))
        toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`)
      } else {
        throw new Error(data.error || 'Failed to update category status')
      }
    } catch (error) {
      console.error('Failed to toggle category status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update category status')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      icon: 'Briefcase', // Default icon for backend compatibility
      color: '#3B82F6', // Default color for backend compatibility
      tags: '',
      isActive: true
    })
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive)
    
    return matchesSearch && matchesFilter
  })

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Briefcase, Code: Hash, Palette: Image, Stethoscope: Heart, Calculator: Hash,
      Camera: Image, Music: Hash, Wrench: Hash, GraduationCap: Hash, Heart,
      Building: Hash, Car: Hash, Plane: Hash, Coffee: Hash, Book: Hash,
      Gamepad2: Hash, Shirt: Hash, Home: Hash
    }
    const IconComponent = iconMap[iconName] || Briefcase
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Simple Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            Category Management
          </h1>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: 'var(--background-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(0, 102, 255, 0.08)',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Search Bar */}
            <div style={{
              position: 'relative',
              flex: '1',
              minWidth: '300px'
            }}>
              <Search style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--primary-blue)',
                width: '20px',
                height: '20px',
                zIndex: 2
              }} />
              <input
                type="text"
                placeholder="Search categories by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '2px solid rgba(0, 102, 255, 0.15)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--background-light-blue)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-blue)';
                  e.target.style.background = 'var(--background-white)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)';
                  e.target.style.background = 'var(--background-light-blue)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Filters */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  border: '2px solid rgba(0, 102, 255, 0.15)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--background-white)',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-blue)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Categories</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  toast.success('Filters cleared');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: '2px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--background-white)',
                  color: '#EF4444',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--background-white)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)';
                }}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Add New Category Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1.5rem'
        }}>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              background: 'var(--gradient-primary)',
              color: 'var(--text-white)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-colored)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 102, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-colored)';
            }}
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </button>
        </div>

        {/* Quick Stats Bar */}
        {/* <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'var(--text-white)',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            minWidth: '150px',
            boxShadow: 'var(--shadow-colored)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {categories.reduce((total, cat) => total + (cat.userCount || 0), 0)}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Users</div>
          </div>
          <div style={{
            background: 'var(--gradient-accent)',
            color: 'var(--text-white)',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            minWidth: '150px',
            boxShadow: '0 10px 25px rgba(253, 161, 70, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {categories.filter(c => c.isActive).length}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Active Categories</div>
          </div>
          <div style={{
            background: 'var(--gradient-secondary)',
            color: 'var(--text-white)',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            minWidth: '150px',
            boxShadow: '0 10px 25px rgba(0, 210, 255, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {categories.reduce((total, cat) => total + cat.tags.length, 0)}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Tags</div>
          </div>
        </div> */}

        {/* Categories Grid */}
        <div style={{
          background: 'var(--background-white)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(0, 102, 255, 0.08)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5rem 2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid var(--primary-blue)',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }} />
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Loading categories...
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5rem 2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--background-light-blue)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Tag style={{ width: '32px', height: '32px', color: 'var(--text-light)' }} />
              </div>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                No categories found
              </div>
              <p style={{
                color: 'var(--text-light)',
                fontSize: '0.875rem'
              }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                justifyContent: 'center'
              }}>
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      background: 'var(--background-white)',
                      border: '1px solid rgba(0, 102, 255, 0.08)',
                      borderRadius: 'var(--radius-2xl)',
                      padding: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-colored)';
                      e.currentTarget.style.borderColor = 'rgba(0, 102, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(0, 102, 255, 0.08)';
                    }}
                  >
                    {/* Decorative Background Element */}
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '80px',
                      height: '80px',
                      background: category.color,
                      borderRadius: '50%',
                      opacity: 0.1,
                      transition: 'all 0.4s ease'
                    }} />

                    {/* Status Badge - Clickable */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      zIndex: 2
                    }}>
                      <button
                        onClick={() => handleToggleStatus(category.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          background: category.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(128, 107, 107, 0.1)',
                          color: category.isActive ? '#53c49eff' : '#fa0303ff',
                          border: `1px solid ${category.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (category.isActive) {
                            e.currentTarget.style.background = 'rgba(107, 114, 128, 0.2)';
                            e.currentTarget.style.color = '#806b6bff';
                          } else {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                            e.currentTarget.style.color = '#10B981';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = category.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)';
                          e.currentTarget.style.color = category.isActive ? '#10B981' : '#ff0400ff';
                        }}
                        title={`Click to ${category.isActive ? 'deactivate' : 'activate'} category`}
                      >
                        {category.isActive ? '✓ Active' : '○ Inactive'}
                      </button>
                    </div>

                    {/* Category Info */}
                    <div style={{
                      marginBottom: '1.5rem',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        lineHeight: '1.3'
                      }}>
                        {category.name}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {category.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        {category.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.75rem',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              background: 'var(--background-light-blue)',
                              color: 'var(--primary-blue)',
                              border: '1px solid rgba(0, 102, 255, 0.15)'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {category.tags.length > 3 && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: 'var(--background-light-blue)',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(0, 102, 255, 0.15)'
                          }}>
                            +{category.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(0, 102, 255, 0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--primary-blue)'
                        }} />
                        <span style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)'
                        }}>
                          {loadingCounts ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>...</span>
                          ) : (
                            <>
                              <span style={{
                                fontWeight: '600',
                                color: 'var(--text-primary)'
                              }}>
                                {category.userCount || 0}
                              </span> users
                            </>
                          )}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-light)'
                      }}>
                        Updated {new Date(category.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}>
                      <button
                        onClick={() => handleEdit(category)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: 'var(--background-light-blue)',
                          color: 'var(--primary-blue)',
                          border: '1px solid rgba(0, 102, 255, 0.2)',
                          borderRadius: 'var(--radius-lg)',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--primary-blue)';
                          e.currentTarget.style.color = 'var(--text-white)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--background-light-blue)';
                          e.currentTarget.style.color = 'var(--primary-blue)';
                        }}
                        title="Edit Category"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.75rem',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#EF4444';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                          e.currentTarget.style.color = '#EF4444';
                        }}
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          zIndex: 50,
          backdropFilter: 'blur(4px)',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'var(--background-white)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            border: '1px solid rgba(0, 102, 255, 0.1)',
            margin: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem 1rem 2rem',
              borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
              background: 'var(--gradient-light)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: '1.875rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'center'
                  }}>
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.5rem',
                    textAlign: 'center'
                  }}>
                    {editingCategory ? 'Update category information' : 'Add a new professional category for digital business cards'}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: 'var(--text-light)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(0, 102, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-light)';
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Category Name */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '2px solid rgba(0, 102, 255, 0.15)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--background-light-blue)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-blue)';
                    e.target.style.background = 'var(--background-white)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)';
                    e.target.style.background = 'var(--background-light-blue)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g., Technology, Healthcare etc."
                  required
                />
              </div>

              {/* Description */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                 
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '2px solid rgba(0, 102, 255, 0.15)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--background-light-blue)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-blue)';
                    e.target.style.background = 'var(--background-white)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)';
                    e.target.style.background = 'var(--background-light-blue)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Brief description of this category"
                />
              </div>

              {/* Tags */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  
                  Search Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '2px solid rgba(0, 102, 255, 0.15)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--background-light-blue)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-blue)';
                    e.target.style.background = 'var(--background-white)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)';
                    e.target.style.background = 'var(--background-light-blue)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g., software, development, programming etc."
                />
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic'
                }}>
                  
                </p>
              </div>

              {/* Status Toggle */}
              

              {/* Action Buttons - Center Aligned */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(0, 102, 255, 0.1)'
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '0.875rem 2rem',
                    border: '2px solid rgba(0, 102, 255, 0.2)',
                    background: 'var(--background-white)',
                    color: 'var(--primary-blue)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--background-light-blue)';
                    e.currentTarget.style.borderColor = 'var(--primary-blue)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--background-white)';
                    e.currentTarget.style.borderColor = 'rgba(0, 102, 255, 0.2)';
                  }}
                >
                 
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.875rem 2rem',
                    background: 'var(--gradient-primary)',
                    color: 'var(--text-white)',
                    border: 'none',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-colored)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 102, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-colored)';
                  }}
                >
                  
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          zIndex: 60,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--background-white)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '500px',
            width: '100%',
            overflow: 'hidden',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '2rem 2rem 1rem 2rem',
              borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '2px solid rgba(239, 68, 68, 0.2)'
              }}>
                <Trash2 style={{
                  width: '24px',
                  height: '24px',
                  color: '#EF4444'
                }} />
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#EF4444',
                margin: '0 0 0.5rem 0'
              }}>
                Delete Category
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                margin: 0
              }}>
                This action cannot be undone
              </p>
            </div>

            {/* Modal Body */}
            <div style={{
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                Are you sure you want to delete the category{' '}
                <strong style={{ color: '#EF4444' }}>"{categoryToDelete.name}"</strong>?
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.4'
              }}>
                All associated data will be permanently removed and cannot be recovered.
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 2rem 2rem 2rem',
              borderTop: '1px solid rgba(239, 68, 68, 0.1)'
            }}>
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid rgba(107, 114, 128, 0.2)',
                  background: 'var(--background-white)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--background-light-blue)';
                  e.currentTarget.style.borderColor = 'var(--primary-blue)';
                  e.currentTarget.style.color = 'var(--primary-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--background-white)';
                  e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.2)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#DC2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#EF4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}