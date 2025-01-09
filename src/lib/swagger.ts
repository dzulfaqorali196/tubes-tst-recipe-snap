import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api/v1',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'RecipeSnap API Documentation',
        version: '1.0.0',
        description: 'API dokumentasi untuk layanan RecipeSnap - Analisis Gambar Bahan Makanan',
        contact: {
          name: 'RecipeSnap Support',
          email: 'support@recipeSnap.com'
        }
      },
      servers: [
        {
          url: '/api/v1',
          description: 'Development Server'
        }
      ],
      paths: {
        '/analyze': {
          post: {
            summary: 'Analisis gambar bahan makanan',
            description: 'Menganalisis gambar bahan makanan dan mengembalikan daftar bahan yang terdeteksi',
            tags: ['Analisis'],
            security: [{ ApiKeyAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      image: {
                        type: 'string',
                        format: 'binary',
                        description: 'File gambar yang akan dianalisis'
                      }
                    }
                  }
                }
              }
            },
            responses: {
              200: {
                description: 'Berhasil menganalisis gambar',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true
                        },
                        data: {
                          type: 'object',
                          properties: {
                            ingredients: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  name: {
                                    type: 'string',
                                    example: 'tomat'
                                  },
                                  confidence: {
                                    type: 'number',
                                    example: 0.95
                                  }
                                }
                              }
                            },
                            timestamp: {
                              type: 'string',
                              format: 'date-time'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/history': {
          get: {
            summary: 'Mendapatkan riwayat analisis',
            description: 'Mengambil riwayat analisis gambar bahan makanan dengan pagination',
            tags: ['Riwayat'],
            security: [{ ApiKeyAuth: [] }],
            parameters: [
              {
                name: 'user_id',
                in: 'query',
                required: true,
                schema: {
                  type: 'string'
                },
                description: 'ID pengguna'
              },
              {
                name: 'limit',
                in: 'query',
                schema: {
                  type: 'integer',
                  default: 10
                },
                description: 'Jumlah data per halaman'
              },
              {
                name: 'offset',
                in: 'query',
                schema: {
                  type: 'integer',
                  default: 0
                },
                description: 'Offset data'
              }
            ],
            responses: {
              200: {
                description: 'Berhasil mengambil riwayat',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true
                        },
                        data: {
                          type: 'object',
                          properties: {
                            history: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  user_id: { type: 'string' },
                                  recipe_data: { type: 'object' },
                                  ingredients: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      properties: {
                                        name: { type: 'string' },
                                        confidence: { type: 'number' }
                                      }
                                    }
                                  },
                                  created_at: {
                                    type: 'string',
                                    format: 'date-time'
                                  }
                                }
                              }
                            },
                            total: {
                              type: 'integer',
                              example: 100
                            },
                            limit: {
                              type: 'integer',
                              example: 10
                            },
                            offset: {
                              type: 'integer',
                              example: 0
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/stats': {
          get: {
            summary: 'Mendapatkan statistik pengguna',
            description: 'Mengambil statistik penggunaan aplikasi oleh pengguna',
            tags: ['Statistik'],
            security: [{ ApiKeyAuth: [] }],
            parameters: [
              {
                name: 'user_id',
                in: 'query',
                required: true,
                schema: {
                  type: 'string'
                },
                description: 'ID pengguna'
              }
            ],
            responses: {
              200: {
                description: 'Berhasil mengambil statistik',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true
                        },
                        data: {
                          type: 'object',
                          properties: {
                            totalScans: {
                              type: 'integer',
                              example: 50
                            },
                            totalShares: {
                              type: 'integer',
                              example: 20
                            },
                            lastUpdated: {
                              type: 'string',
                              format: 'date-time'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-api-key'
          }
        }
      }
    }
  });
  return spec;
}; 